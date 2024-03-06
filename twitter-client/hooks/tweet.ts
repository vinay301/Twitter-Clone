import { graphQLClient } from "@/clients/api"
import { CreateTweetData, LikeTweetMutationVariables } from "@/gql/graphql"
import { likedTweetMutation } from "@/graphql/mutation/likedTweet"
import { createTweetMutation } from "@/graphql/mutation/tweet"
import { getAllTweetsQuery } from "@/graphql/query/tweet"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"

export const useCreateTweet = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (payload: CreateTweetData) => graphQLClient.request(createTweetMutation, {payload}),
        onMutate: (payload) => toast.loading('Creating Tweet',{id:'1'}),
        onSuccess: async(payload) => {
           await queryClient.invalidateQueries({queryKey: ['all-tweets']})
           toast.success('Created Tweet', {id:'1'})
        }
    })

    return mutation;
}

export const useGetAllTweets = () => {
    const query = useQuery({
        queryKey: ['all-tweets'],
        queryFn: () => graphQLClient.request(getAllTweetsQuery)
    })
    return { ...query, tweets: query.data?.getAllTweets}
}

export const useLikeTweet = () => {
    const queryClient = useQueryClient();
  
    const mutation = useMutation({
      mutationFn: ({ tweetId, userId }: LikeTweetMutationVariables) => graphQLClient.request(likedTweetMutation, { tweetId, userId }),
      onSuccess: async (payload) => {
        await queryClient.invalidateQueries({ queryKey: ['like-tweets'] });
        toast.success('Tweet Liked');
      },
      onError: (error) => {
        toast.error('Failed to like the tweet');
      },
    });
  
    return mutation;
  };