import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { POSTS } from './mock-posts';
// import * as jwt from 'jsonwebtoken';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  private username: string = "cs144";
  private posts: Post[] = [];
  private ApiUrl = 'http://localhost:3000/api/';

  constructor(
    private http: HttpClient
  ) { 
    this.fetchPosts(this.username);
  }

  fetchPosts(username: string): void{
    let GetUrl = this.ApiUrl.concat(username);
    var posts: Post[] = [];
    this.http.get<Post[]>(GetUrl).subscribe(data => {
      this.cocantPosts(data);
    });
  }

  cocantPosts(data): void {
    var d;
    for(d in data){
      this.posts.push(data[d]);
    }
  }

  getPosts(): Post[]{
    return this.posts;
  }

  getPosts_mock(): Observable<Post[]>{
    return of(POSTS);
  }

  getPost(id: number): Post{
    let ret_post = this.posts.find( ret_post => ret_post.postid == id);
    return ret_post;
  }

  getId(): number{
    var max_id = 0;
    for(let post of this.posts){
      if(post.postid > max_id) max_id = post.postid + 1;
    }
    return max_id;
  }

  newPost(): Post{
    var new_post = new Post();
    new_post.postid = this.getId()+1;
    new_post.created = new Date((new Date()));
    new_post.modified = new Date((new Date()));
    new_post.title = "";
    new_post.body = "";

    let PostUrl = this.ApiUrl.concat(this.username).concat('/').concat(new_post.postid.toString());
    console.log(PostUrl);

    this.posts.push(new_post);
    this.http.post<Post>(PostUrl, new_post, httpOptions).subscribe();
    return new_post;
    //TODO: Check 201
  }

  updatePost(username: string, post: Post): void{
    let PutUrl = this.ApiUrl.concat(username).concat('/').concat(post.postid.toString());
    this.http.put(PutUrl, post, httpOptions);
    this.posts.find(p=>p.postid==post.postid).title = post.title
    this.posts.find(p=>p.postid==post.postid).body = post.body
    this.posts.find(p=>p.postid==post.postid).modified = new Date((new Date()).getTime() + 24*60*60*1000);
    //TODO: Check 200
  }

  deletePost(username: string, postid: number): void {
    let DeleteUrl = this.ApiUrl.concat(username).concat('/').concat(postid.toString());
    this.http.delete(DeleteUrl, httpOptions);
    this.posts = this.posts.filter(p => p.postid !== postid);
    //TODO: Check 204
  }
}


export class Post {
  postid: number;
  created: Date;
  modified: Date;
  title: string;
  body: string;
}
