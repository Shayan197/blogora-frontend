// ===========================================================
//                          PUBLIC_ENDPOINTS
// ===========================================================
// These endpoints can be accessed publicly without blocking on auth token expiration.
const PUBLIC_ENDPOINTS = [
    'login',
    'signup',
    'otpVerify',
    'otpResend',
    'forgetPassword',
    'forgetPasswordOtpVerify',
    'forgetPasswordReset',
    'listBlogs',
    'getTrendingBlogs',
    'getBlogBySlug',
    'getBlogLikers',
    'listCategories',
    'getCategoryBySlug',
    'listTags',
    'getTagBySlug',
    'getBlogComments',
    'getPublicProfile',
];

export default PUBLIC_ENDPOINTS;
