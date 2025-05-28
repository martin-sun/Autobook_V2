-- Create separate workspace creation function for onboarding
CREATE OR REPLACE FUNCTION create_workspace(
  p_name TEXT,
  p_type TEXT,
  p_currency TEXT DEFAULT 'CAD'
)
RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  v_workspace_id UUID;
  v_template_id UUID;
  v_current_year INTEGER;
  v_fiscal_year_start DATE;
  v_fiscal_year_end DATE;
  v_fiscal_year_id UUID;
BEGIN
  -- Validate user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  -- Validate workspace type
  IF p_type NOT IN ('personal', 'business') THEN
    RAISE EXCEPTION 'Invalid workspace type. Must be "personal" or "business"';
  END IF;
  
  -- Create workspace
  INSERT INTO workspaces (user_id, name, type, currency, owner_id, created_by)
  VALUES (auth.uid(), p_name, p_type, p_currency, auth.uid(), auth.uid())
  RETURNING id INTO v_workspace_id;
  
  -- Add user as workspace member
  INSERT INTO workspace_members (workspace_id, user_id, role_id, status, invited_by)
  VALUES (v_workspace_id, auth.uid(), 
    (SELECT id FROM roles WHERE name = 'Owner' LIMIT 1),
    'active', auth.uid());
  
  -- Initialize workspace defaults
  -- Set sidebar menu
  SELECT id INTO v_template_id
  FROM sidebar_templates
  WHERE workspace_type = p_type
  LIMIT 1;
  
  IF v_template_id IS NOT NULL THEN
    INSERT INTO workspace_menu_configs (workspace_id, template_id)
    VALUES (v_workspace_id, v_template_id);
  END IF;
  
  -- Create default fiscal year
  v_current_year := EXTRACT(YEAR FROM CURRENT_DATE);
  
  -- Default fiscal year starts January 1st and ends December 31st
  v_fiscal_year_start := TO_DATE(v_current_year || '-01-01', 'YYYY-MM-DD');
  v_fiscal_year_end := TO_DATE(v_current_year || '-12-31', 'YYYY-MM-DD');
  
  -- Create fiscal year
  INSERT INTO fiscal_years (workspace_id, name, start_date, end_date, created_by)
  VALUES (v_workspace_id, v_current_year::TEXT, v_fiscal_year_start, v_fiscal_year_end, auth.uid())
  RETURNING id INTO v_fiscal_year_id;
  
  -- Copy default chart of accounts based on workspace type
  IF p_type = 'personal' THEN
    -- Copy default account groups
    INSERT INTO account_groups (workspace_id, account_type, name, description, display_order)
    SELECT v_workspace_id, account_type, name, description, display_order
    FROM account_groups
    WHERE workspace_type = 'personal' AND is_template = TRUE;
    
    -- Copy default chart of accounts
    INSERT INTO chart_of_accounts (workspace_id, code, name, type, description)
    SELECT v_workspace_id, code, name, type, description
    FROM chart_of_accounts
    WHERE workspace_id IS NULL AND type IN ('asset', 'liability', 'equity', 'income', 'expense');
  
  -- If business workspace, use business templates
  ELSIF p_type = 'business' THEN
    -- Copy default account groups
    INSERT INTO account_groups (workspace_id, account_type, name, description, display_order)
    SELECT v_workspace_id, account_type, name, description, display_order
    FROM account_groups
    WHERE workspace_type = 'business' AND is_template = TRUE;
    
    -- Copy default chart of accounts
    INSERT INTO chart_of_accounts (workspace_id, code, name, type, description)
    SELECT v_workspace_id, code, name, type, description
    FROM chart_of_accounts
    WHERE workspace_id IS NULL AND type IN ('asset', 'liability', 'equity', 'income', 'expense');
  END IF;
  
  RETURN v_workspace_id;
END;
$$;

-- Create a function to check if user has completed onboarding
CREATE OR REPLACE FUNCTION check_onboarding_status()
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  v_has_workspaces BOOLEAN;
BEGIN
  -- Check if user has any workspaces
  SELECT EXISTS (
    SELECT 1 FROM workspace_members wm
    JOIN workspaces w ON w.id = wm.workspace_id
    WHERE wm.user_id = auth.uid()
    AND wm.status = 'active'
    AND w.is_deleted = FALSE
  ) INTO v_has_workspaces;
  
  -- Return true if user has completed onboarding (has workspaces)
  RETURN v_has_workspaces;
END;
$$;
