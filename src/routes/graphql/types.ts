import { MemberTypeEntity } from "../../utils/DB/entities/DBMemberTypes";
import { PostEntity } from "../../utils/DB/entities/DBPosts";
import { ProfileEntity } from "../../utils/DB/entities/DBProfiles";
import { UserEntity } from "../../utils/DB/entities/DBUsers";

export type ID = {
    id: string;
  }
  
export type UserInput = {
    input: {
      firstName: string;
      lastName: string;
      email: string;
      subscribedToUserIds?: string[];
    }
  }
  
export type UserUpdateInput = {
    input: {
      id: string;
      firstName?: string;
      lastName?: string;
      email?: string;
      subscribedToUserIds?: string[];
    }
  }
  
export  type ProfileInput = {
    input: {
      avatar: string;
      sex: string;
      birthday: number;
      country: string;
      street: string;
      city: string;
      memberTypeId: string;
      userId: string;
    }
  }
  
export type ProfileUpdateInput = {
    input: {
      id: string;
      avatar: string;
      sex: string;
      birthday: number;
      country: string;
      street: string;
      city: string;
      memberTypeId: string;
      userId: string;
    }
  }
export type PostInput = {
    input: {
      title: string;
      content: string;
      userId: string;
    }
  }
  
export type PostUpdateInput = {
    input: {
      id: string;
      title: string;
      content: string;
      userId: string;
    }
  }
  
export type MemberTypeUpdateInput = {
    input: {
      id: string;
      discount: number;
      monthPostsLimit: number;
    }
  }
  
export type SubscribeInput = {
    input: {
      id: string;
      userId: string;
    }
  }
  
export type UserWithInfo = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    subscribedToUserIds: string[];
    profile: ProfileEntity | null;
    posts: PostEntity[] | null;
    memberType: MemberTypeEntity | null;
   }
  
export type UserWithSubscribeTo = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    subscribedToUserIds: string[];
    userSubscribeTo: UserEntity[];
    profile: ProfileEntity | null;
   }
  
export type UsersWithSubscribersAndSubscriptions = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    subscribedToUserIds: string[];
    userSubscribeTo: UserEntity[];
    subscribedToUser: UserEntity[];
   }