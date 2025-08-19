// ============================================= 
// 制品管理相关TypeScript类型定义
// ============================================= 

/**
 * 制品类型接口
 */
export interface ArtifactType {
  id: number // 类型ID
  name: string // 制品类型名称，如DOCKER,NPM,JAR
  description?: string // 类型描述
  created_at: string // 创建时间
}

/**
 * 制品类型表单类型
 */
export interface ArtifactTypeForm {
  name: string
  description?: string
}

/**
 * 制品仓库接口
 */
export interface ArtifactRepo {
  id: number // 仓库ID
  name: string // 仓库名称
  type_id: number // 制品类型ID
  url: string // 仓库地址
  username?: string // 仓库用户名
  password?: string // 仓库密码
  created_at: string // 创建时间
  updated_at: string // 更新时间
  artifact_type?: ArtifactType // 关联的制品类型
}

/**
 * 制品仓库表单类型
 */
export interface ArtifactRepoForm {
  name: string
  type_id: number
  url: string
  username?: string
  password?: string
}

/**
 * 制品接口
 */
export interface Artifact {
  id: number // 制品ID
  project_id: number // 所属项目ID
  repo_id: number // 制品仓库ID
  name: string // 制品名称，例如镜像名或包名
  version: string // 版本号或Tag
  type_id: number // 制品类型ID
  path: string // 仓库路径/地址
  created_at: string // 创建时间
  project?: Project // 关联的项目信息
  artifact_repo?: ArtifactRepo // 关联的制品仓库
  artifact_type?: ArtifactType // 关联的制品类型
}

/**
 * 制品表单类型
 */
export interface ArtifactForm {
  project_id: number
  repo_id: number
  name: string
  version: string
  type_id: number
  path: string
}

/**
 * 制品下载操作类型
 */
export type ArtifactDownloadAction = 'PULL' | 'DOWNLOAD'

/**
 * 制品下载记录接口
 */
export interface ArtifactDownload {
  id: number // 下载记录ID
  artifact_id: number // 制品ID
  user_id?: number // 下载用户ID，可为空系统操作
  host_id?: number // 下载目标主机ID，可为空
  action: ArtifactDownloadAction // 操作类型：拉取或下载
  created_at: string // 操作时间
  artifact?: Artifact // 关联的制品信息
  user?: User // 关联的用户信息
  host?: Host // 关联的主机信息
}

/**
 * 制品统计信息
 */
export interface ArtifactStats {
  totalArtifacts: number // 制品总数
  totalRepos: number // 仓库总数
  totalDownloads: number // 下载总数
  recentDownloads: number // 最近下载数
  artifactsByType: Record<string, number> // 按类型分组的制品数量
  downloadsByDay: Array<{ date: string; count: number }> // 按日期分组的下载量
}

/**
 * 制品搜索参数
 */
export interface ArtifactSearchParams {
  keyword?: string // 关键词搜索
  project_id?: number // 项目ID筛选
  repo_id?: number // 仓库ID筛选
  type_id?: number // 类型ID筛选
  version?: string // 版本筛选
  date_range?: [string, string] // 时间范围筛选
}

/**
 * 制品详情扩展信息
 */
export interface ArtifactDetail extends Artifact {
  size?: number // 制品大小（字节）
  digest?: string // 制品摘要/哈希值
  tags?: string[] // 标签列表
  download_count: number // 下载次数
  last_download_at?: string // 最后下载时间
  metadata?: Record<string, any> // 元数据信息
}

/**
 * 制品版本历史
 */
export interface ArtifactVersion {
  id: number
  artifact_id: number
  version: string
  size?: number
  created_at: string
  is_latest: boolean
}

/**
 * 制品依赖关系
 */
export interface ArtifactDependency {
  id: number
  artifact_id: number
  dependency_id: number
  version_constraint?: string
  created_at: string
  dependency?: Artifact
}

/**
 * 制品安全扫描结果
 */
export interface ArtifactScanResult {
  id: number
  artifact_id: number
  scan_type: 'vulnerability' | 'license' | 'quality'
  status: 'pending' | 'scanning' | 'completed' | 'failed'
  result?: {
    high_issues: number
    medium_issues: number
    low_issues: number
    details?: any[]
  }
  scanned_at: string
}

/**
 * 制品使用统计
 */
export interface ArtifactUsage {
  artifact_id: number
  daily_downloads: number
  weekly_downloads: number
  monthly_downloads: number
  total_downloads: number
  unique_users: number
  last_used_at?: string
}

// 导入相关类型（假设这些类型在其他文件中定义）
import type { Project } from './devops'
import type { User } from './auth'
import type { Host } from './devops'