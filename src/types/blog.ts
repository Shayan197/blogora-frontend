export type Role = {
    id: number;
    uuid: string;
    name: string;
    slug: string;
    description?: string;
    priority: number;
    color?: string;
    icon?: string;
};

export type ProfileData = {
    id?: number;
    uuid?: string;
    userId?: number;
    headline?: string | null;
    bio?: string | null;
    avatar?: string | null;
    coverImage?: string | null;
    websiteUrl?: string | null;
    twitterUrl?: string | null;
    githubUrl?: string | null;
    linkedinUrl?: string | null;
    location?: string | null;
    createdAt?: string;
    updatedAt?: string;
};

export type Author = {
    id?: number;
    uuid: string;
    firstName: string;
    lastName: string;
    fullName?: string;
    email?: string;
    avatar?: string | null;
    bio?: string | null;
    skills?: string[];
    experience?: number;
    role?: Role;
    profile?: ProfileData;
    createdAt?: string;
};

export type Category = {
    id: number;
    uuid: string;
    name: string;
    slug: string;
    description?: string | null;
    icon?: string | null;
    color?: string | null;
    isActive: boolean;
    blogsCount?: number;
    createdAt?: string;
    updatedAt?: string;
};

export type Tag = {
    id: number;
    uuid: string;
    name: string;
    slug: string;
    description?: string | null;
    usageCount: number;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
};

export type BlogStatus = 'draft' | 'published' | 'archived';

export type Blog = {
    id: number;
    uuid: string;
    authorId?: number;
    categoryId?: number;
    title: string;
    slug: string;
    subtitle?: string | null;
    content: string;
    coverImage?: string | null;
    readingTime: number;
    viewsCount: number;
    likesCount: number;
    commentsCount: number;
    status: BlogStatus;
    publishedAt?: string | null;
    isFeatured: boolean;
    isPremium: boolean;
    author?: Author;
    category?: Category;
    tags?: Tag[];
    createdAt: string;
    updatedAt?: string;
};

export type Comment = {
    id: number;
    uuid: string;
    blogId?: number;
    userId?: number;
    parentId?: number | null;
    content: string;
    likesCount: number;
    status?: 'approved' | 'pending' | 'spam' | 'deleted';
    user?: Author;
    replies?: Comment[];
    createdAt: string;
    updatedAt: string;
};

export type NotificationType = 'like' | 'comment' | 'reply' | 'publish' | 'system';

export type Notification = {
    id: number;
    uuid: string;
    recipientId: number;
    actorId: number;
    type: NotificationType;
    entityId?: number | null;
    message: string;
    isRead: boolean;
    readAt?: string | null;
    actor?: Author;
    createdAt: string;
    updatedAt: string;
};

export type PaginationMeta = {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
};

export type PaginatedResponse<T> = {
    items: T[];
    pagination: PaginationMeta;
};

export type BlogFeedQuery = {
    page?: number;
    limit?: number;
    category?: string;
    tag?: string;
    author?: string;
    search?: string;
    featured?: 'true' | 'false';
    sort?: 'latest' | 'popular' | 'top';
};

export type CreateBlogPayload = {
    title: string;
    subtitle?: string;
    content: string;
    categoryId: number;
    tagIds?: number[];
    coverImage?: string;
    status?: BlogStatus;
    isFeatured?: boolean;
    isPremium?: boolean;
    slug?: string;
};

export type UpdateBlogPayload = Partial<CreateBlogPayload>;

export type CreateCategoryPayload = {
    name: string;
    description?: string;
    icon?: string;
    color?: string;
    slug?: string;
};

export type UpdateCategoryPayload = Partial<CreateCategoryPayload> & {
    isActive?: boolean;
};

export type CreateTagPayload = {
    name: string;
    description?: string;
    slug?: string;
};

export type UpdateTagPayload = Partial<CreateTagPayload> & {
    isActive?: boolean;
};

export type CreateCommentPayload = {
    content: string;
    parentCommentUuid?: string;
};

export type UpdateCommentPayload = {
    content: string;
};

export type UserListItem = {
    id: number;
    uuid: string;
    firstName: string;
    lastName: string;
    email: string;
    gender: string;
    status: 'pending' | 'active' | 'blocked' | 'suspended';
    isActive: boolean;
    loginCount: number;
    lastLogin?: string | null;
    role?: Role;
    profile?: ProfileData;
    createdAt: string;
};

export type UpdateUserRolePayload = {
    roleId: number;
};

export type UpdateUserStatusPayload = {
    status: 'pending' | 'active' | 'blocked' | 'suspended';
};
