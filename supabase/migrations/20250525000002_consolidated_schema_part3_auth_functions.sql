-- AutoBooks 综合数据库结构 - 第3部分：认证和用户相关函数
-- 生成日期: 2025-05-25
-- 此文件包含认证和用户相关的函数

-- 获取当前用户ID函数
CREATE OR REPLACE FUNCTION get_current_user_id()
RETURNS UUID
LANGUAGE SQL SECURITY DEFINER
AS $$
  SELECT auth.uid()
$$;

-- 检查工作空间成员资格函数
CREATE OR REPLACE FUNCTION check_workspace_membership(workspace_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM workspace_members
    WHERE workspace_id = $1
    AND user_id = auth.uid()
    AND status = 'active'
  );
END;
$$;

-- 删除以下函数定义
DROP FUNCTION IF EXISTS initialize_workspace_defaults;

-- 获取用户工作空间函数
CREATE OR REPLACE FUNCTION get_user_workspaces()
RETURNS TABLE (
  id UUID,
  name TEXT,
  type TEXT,
  currency TEXT,
  created_at TIMESTAMPTZ,
  is_owner BOOLEAN,
  role_name TEXT
)
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    w.id,
    w.name,
    w.type,
    w.currency,
    w.created_at,
    w.owner_id = auth.uid() AS is_owner,
    r.name AS role_name
  FROM workspaces w
  LEFT JOIN workspace_members wm ON w.id = wm.workspace_id AND wm.user_id = auth.uid()
  LEFT JOIN roles r ON wm.role_id = r.id
  WHERE (w.user_id = auth.uid() OR w.owner_id = auth.uid() OR wm.user_id = auth.uid())
    AND w.is_deleted = FALSE
    AND (wm.status = 'active' OR wm.status IS NULL)
  ORDER BY w.created_at DESC;
END;
$$;

-- 邀请用户加入工作空间函数
CREATE OR REPLACE FUNCTION invite_user_to_workspace(
  p_workspace_id UUID,
  p_email TEXT,
  p_role_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_is_owner BOOLEAN;
BEGIN
  -- 验证用户已登录
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  -- 验证当前用户是否是工作空间所有者
  SELECT owner_id = auth.uid() INTO v_is_owner
  FROM workspaces
  WHERE id = p_workspace_id;
  
  IF NOT v_is_owner THEN
    RAISE EXCEPTION 'Only workspace owner can invite users';
  END IF;
  
  -- 查找被邀请用户ID
  SELECT id INTO v_user_id
  FROM users
  WHERE email = p_email;
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', p_email;
  END IF;
  
  -- 检查用户是否已经是工作空间成员
  IF EXISTS (
    SELECT 1 FROM workspace_members
    WHERE workspace_id = p_workspace_id AND user_id = v_user_id
  ) THEN
    RAISE EXCEPTION 'User is already a member of this workspace';
  END IF;
  
  -- 添加用户为工作空间成员
  INSERT INTO workspace_members (workspace_id, user_id, role_id, status, invited_by)
  VALUES (p_workspace_id, v_user_id, p_role_id, 'pending', auth.uid());
  
  RETURN TRUE;
END;
$$;

-- 接受工作空间邀请函数
CREATE OR REPLACE FUNCTION accept_workspace_invitation(
  p_workspace_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  -- 验证用户已登录
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  -- 验证邀请存在
  IF NOT EXISTS (
    SELECT 1 FROM workspace_members
    WHERE workspace_id = p_workspace_id
    AND user_id = auth.uid()
    AND status = 'pending'
  ) THEN
    RAISE EXCEPTION 'No pending invitation found for this workspace';
  END IF;
  
  -- 更新邀请状态
  UPDATE workspace_members
  SET status = 'active', accepted_at = NOW()
  WHERE workspace_id = p_workspace_id
  AND user_id = auth.uid();
  
  RETURN TRUE;
END;
$$;

-- 删除以下函数定义
DROP FUNCTION IF EXISTS create_workspace;
