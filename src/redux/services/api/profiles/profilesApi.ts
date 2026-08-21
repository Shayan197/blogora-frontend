import { apiSlice, ResponseType } from '@/redux/services/apiSlice/apiSlice';
import type { Author, Blog, ProfileData } from '@/types/blog';

type PublicProfileResponse = ResponseType<{
    user: Author;
    stats: {
        publishedBlogsCount: number;
    };
    recentBlogs: Partial<Blog>[];
}>;

type MyProfileResponse = ResponseType<{
    user: Author & {
        profile?: ProfileData;
    };
}>;

type ProfileMutationResponse = ResponseType<{
    profile: ProfileData;
}>;

export const profilesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPublicProfile: builder.query<PublicProfileResponse, string>({
            query: (userUuid) => `/profiles/author/${userUuid}`,
        }),

        getMyProfile: builder.query<MyProfileResponse, void>({
            query: () => '/profiles/me',
            providesTags: ['UserProfile'],
        }),

        updateMyProfile: builder.mutation<ProfileMutationResponse, Partial<ProfileData>>({
            query: (profileData) => ({
                url: '/profiles/me',
                method: 'PUT',
                body: profileData,
            }),
            invalidatesTags: ['UserProfile'],
        }),
    }),
    overrideExisting: true,
});

export const { useGetPublicProfileQuery, useGetMyProfileQuery, useUpdateMyProfileMutation } =
    profilesApi;
