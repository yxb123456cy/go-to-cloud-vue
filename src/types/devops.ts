// 项目TS类型接口
export interface Project {
  id: number // 项目ID;
  name: string // 项目名称;
  repo_url: string // 项目仓库地址;
  branch: string // 项目分支;
  build_cmd: string // 项目构建命令;
  image_name: string // 镜像名称;
  created_at: string // 创建时间;
  updated_at: string // 更新时间;
}

/**
 * 项目表单相关类型
 */
export interface ProjectForm {
  name: string
  repo_url: string
  branch: string
  build_cmd: string
  image_name: string
}

// 构建历史相关类型
export type BuildStatus = 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILED'

/**
 * 构建历史相关类型
 */
export interface BuildHistory {
  id: number
  project_id: number
  image_tag: string
  status: BuildStatus
  log?: string
  created_at: string
  updated_at: string
  project?: Project
}

// 主机组相关类型
export interface HostGroup {
  id: number
  name: string
  description?: string
  created_at: string
  updated_at: string
}

export interface HostGroupForm {
  name: string
  description?: string
}

// 主机相关类型
export type HostStatus = 'ONLINE' | 'OFFLINE'

export interface Host {
  id: number
  host_group_id: number
  name: string
  ip: string
  port: number
  status: HostStatus
  created_at: string
  updated_at: string
  host_group?: HostGroup // 关联的主机组信息
}

export interface HostForm {
  host_group_id: number
  name: string
  ip: string
  port: number
}

// 部署历史相关类型
export type DeployStatus = 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILED'

export interface DeployHistory {
  id: number
  project_id: number
  host_id: number
  image_tag: string
  container_name: string
  status: DeployStatus
  log?: string
  created_at: string
  updated_at: string
  project?: Project // 关联的项目信息
  host?: Host // 关联的主机信息
}

// =============================================
// 镜像仓库相关类型
// =============================================
/**
 * 镜像仓库接口
 */
export interface ImageRepo {
  id: number // 仓库ID
  name: string // 仓库名称
  url: string // 仓库地址
  username?: string // 仓库用户名
  password?: string // 仓库密码（建议加密存储）
  created_at: string // 创建时间
  updated_at: string // 更新时间
}

/**
 * 镜像仓库表单类型
 */
export interface ImageRepoForm {
  name: string
  url: string
  username?: string
  password?: string
}

// =============================================
// 构建节点相关类型
// =============================================
export type BuildNodeStatus = 'ONLINE' | 'OFFLINE'

/**
 * 构建节点接口
 */
export interface BuildNode {
  id: number // 节点ID
  name: string // 节点名称
  ip: string // 节点IP
  port: number // SSH或API端口
  status: BuildNodeStatus // 节点状态
  created_at: string // 创建时间
  updated_at: string // 更新时间
}

/**
 * 构建节点表单类型
 */
export interface BuildNodeForm {
  name: string
  ip: string
  port: number
}

// API响应类型
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export interface PaginationResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

// Dashboard统计数据类型
export interface DashboardStats {
  totalProjects: number
  totalHosts: number
  onlineHosts: number
  offlineHosts: number
  runningBuilds: number
  successBuilds: number
  failedBuilds: number
  runningDeploys: number
  successDeploys: number
  failedDeploys: number
  // 新增镜像仓库和构建节点统计
  totalImageRepos: number
  totalBuildNodes: number
  onlineBuildNodes: number
  offlineBuildNodes: number
}

// 最近活动类型
export interface RecentActivity {
  id: number
  type: 'build' | 'deploy'
  project_name: string
  status: BuildStatus | DeployStatus
  created_at: string
  host_name?: string // 部署活动才有
}

// =============================================
// 扩展类型定义
// =============================================

/**
 * 系统配置类型
 */
export interface SystemConfig {
  id: number
  key: string
  value: string
  description?: string
  created_at: string
  updated_at: string
}

/**
 * 用户权限类型
 */
export type UserRole = 'admin' | 'developer' | 'viewer'

/**
 * 操作日志类型
 */
export interface OperationLog {
  id: number
  user_id: number
  action: string
  resource_type: string
  resource_id: number
  details?: string
  ip_address?: string
  user_agent?: string
  created_at: string
}

/**
 * 通知类型
 */
export interface Notification {
  id: number
  title: string
  content: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  created_at: string
}

/**
 * 构建配置类型
 */
export interface BuildConfig {
  id: number
  project_id: number
  dockerfile_path?: string
  build_args?: Record<string, string>
  env_vars?: Record<string, string>
  timeout: number // 构建超时时间（秒）
  retry_count: number // 重试次数
  created_at: string
  updated_at: string
}

/**
 * 部署配置类型
 */
export interface DeployConfig {
  id: number
  project_id: number
  host_id: number
  container_port: number
  host_port: number
  env_vars?: Record<string, string>
  volumes?: string[]
  restart_policy: 'no' | 'always' | 'unless-stopped' | 'on-failure'
  created_at: string
  updated_at: string
}

/**
 * 监控指标类型
 */
export interface MetricData {
  timestamp: string
  cpu_usage: number
  memory_usage: number
  disk_usage: number
  network_in: number
  network_out: number
}

/**
 * 容器状态类型
 */
export interface ContainerStatus {
  id: string
  name: string
  image: string
  status: 'running' | 'stopped' | 'paused' | 'restarting'
  created_at: string
  ports: string[]
  host_id: number
}

/**
 * 镜像信息类型
 */
export interface ImageInfo {
  id: string
  repository: string
  tag: string
  size: number
  created_at: string
  digest: string
}

/**
 * 构建步骤类型
 */
export interface BuildStep {
  id: number
  build_id: number
  step_name: string
  command: string
  status: BuildStatus
  start_time?: string
  end_time?: string
  log?: string
  order: number
}

/**
 * Webhook配置类型
 */
export interface WebhookConfig {
  id: number
  project_id: number
  url: string
  secret?: string
  events: string[]
  active: boolean
  created_at: string
  updated_at: string
}

/**
 * 环境变量类型
 */
export interface EnvironmentVariable {
  id: number
  project_id: number
  key: string
  value: string
  description?: string
  is_secret: boolean
  created_at: string
  updated_at: string
}
