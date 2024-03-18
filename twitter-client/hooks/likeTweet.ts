import { graphQLClient } from "@/clients/api";
import { LikeTweetMutationVariables, UnlikeTweetMutationVariables } from "@/gql/graphql";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UnLikeTweetMutation, likedTweetMutation } from "@/graphql/mutation/likedTweet"
import toast from "react-hot-toast";

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

  export const useUnLikeTweet = () => {
    const queryClient = useQueryClient();
  
    const mutation = useMutation({
      mutationFn: ({ tweetId, userId }: UnlikeTweetMutationVariables) => graphQLClient.request(UnLikeTweetMutation, { tweetId, userId }),
      onSuccess: async (payload) => {
        await queryClient.invalidateQueries({ queryKey: ['unlike-tweet'] });
        toast.success('Tweet UnLiked');
      },
      onError: (error) => {
        toast.error('Failed to unlike the tweet');
      },
    });
  
    return mutation;
  };