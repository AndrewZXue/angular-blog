import {Post} from "./blog.service";

let time_now = new Date((new Date()).getTime());
export const POSTS: Post[] = [
    { postid: 1, created: time_now, modified: time_now, title: 'Post 1', body:'Body of Post 1'},
    { postid: 2, created: time_now, modified: time_now, title: 'Post 2', body:'Body of Post 2'},
    { postid: 3, created: time_now, modified: time_now, title: 'Post 3', body:'Body of Post 3'}
  ];