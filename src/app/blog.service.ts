import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(
    private http: HttpClient
  ) { }
  private posts: Post[];
  private ApiUrl = 'http://localhost:3000/api/';

  fetchPosts(username: string): void{
    let GetUrl = this.ApiUrl.concat(username);
    this.http.get<Post[]>(GetUrl).subscribe((data) => {
      this.posts.concat(data);
    });
    //TODO: Check 404
  }

  getPosts(username: string): Post[]{
    this.fetchPosts(username);
    return this.posts;
  }

  getPost(username: string, id: number): Post{
    this.fetchPosts(username);
    let ret_post = this.posts.find( ret_post => ret_post.postid == id);
    return ret_post;
  }

  getId(username: string): number{
    var max_id = 0;
    for(let post of this.posts){
      if(post.postid > max_id) max_id = post.postid + 1;
    }
    return max_id;
  }

  newPost(username: string): Post{
    this.fetchPosts(username);
    var new_post = new Post();
    new_post.postid = this.getId(username);
    new_post.created = new Date((new Date()).getTime() + 24*60*60*1000);
    new_post.modified = new Date((new Date()).getTime() + 24*60*60*1000);
    new_post.title = "";
    new_post.body = "";

    let PostUrl = this.ApiUrl.concat(username).concat('/').concat(new_post.postid.toString());

    this.posts.push(new_post);
    this.http.post<Post>(PostUrl, new_post, httpOptions);
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
