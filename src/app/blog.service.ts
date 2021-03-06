import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  private username: string;
  private posts: Post[] = [];
  private ApiUrl = 'http://localhost:3000/api/';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.parseJWT();
    this.fetchPosts(this.username);
  }

  parseJWT(): void {
    let token = document.cookie.replace(/(?:(?:^|.*;\s*)jwt\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    if (token === null || token === '') {
      window.location.href = 'http://localhost:3000/login?redirect=/editor';
      return;
    }
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    this.username = JSON.parse(atob(base64)).usr;
  }

  fetchPosts(username: string): void{
    let GetUrl = this.ApiUrl.concat(username);
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

  getPost(id: number): Post{
    let ret_post = this.posts.find( ret_post => ret_post.postid == id);
    return ret_post;
  }

  getId(): number{
    var max_id = 0;
    for(let post of this.posts){
      if(post.postid > max_id) max_id = post.postid;
    }
    return max_id;
  }

  newPost(): Post {
    let new_post = {
      postid: this.getId() + 1,
      created: new Date(),
      modified: new Date(),
      title: "",
      body: ""
    };
    // var new_post = new Post();
    // new_post.postid = this.getId() + 1;
    // new_post.created = new Date((new Date()));
    // new_post.modified = new Date((new Date()));
    // new_post.title = "";
    // new_post.body = "";
    const json_post = JSON.parse(JSON.stringify(new_post));

    let PostUrl = this.ApiUrl.concat(this.username).concat('/').concat(new_post.postid.toString());

    this.posts.push(new_post);
    var newPost = this.http.post<Post>(PostUrl, json_post, httpOptions).pipe(
      catchError((err) => {
        console.log(json_post);
        console.log("bp 1");
        if (err.status != 201){
          alert(err.status + ", Error when creating a new post");
          this.router.navigate(["/"]);
          this.posts.pop();
        }
        return throwError(err);
      })
    );
    newPost.subscribe();
    return new_post;
  }

  updatePost(post: Post): void{
    var flag = true;
    let PutUrl = this.ApiUrl.concat(this.username).concat('/').concat(post.postid.toString());
    var updatePost = this.http.put(PutUrl, post, httpOptions).pipe(
      catchError((err) => {
        if (err.status != 200){
          alert(err.status + ", Error when updating a post");
          this.router.navigate(["/edit/" + post.postid.toString()]);
          flag = false;
        }
        return throwError(err);
      })
    );
    updatePost.subscribe();
    if (flag){
      this.posts.find(p=>p.postid==post.postid).title = post.title;
      this.posts.find(p=>p.postid==post.postid).body = post.body;
      this.posts.find(p=>p.postid==post.postid).modified = new Date((new Date()).getTime());
    }
  }

  deletePost(postid: number): void {
    let DeleteUrl = this.ApiUrl.concat(this.username).concat('/').concat(postid.toString());
    var tempPosts = this.posts;
    var deletePost = this.http.delete(DeleteUrl, httpOptions).pipe(
      catchError((err) => {
        if (err.status != 204){
          alert(err.status + ", Error when deleting a post");
          this.router.navigate(["/"]);
          this.posts = tempPosts;
        }
        return throwError(err);
      })
    );
    deletePost.subscribe();

    let postIndex = -1;
    for (let i in this.posts) {
      if (this.posts[i].postid == postid) {
        postIndex = parseInt(i);
      }
    }

    if (postIndex != -1) {
      this.posts.splice(postIndex, 1);
    }
  }
}

export class Post {
  postid: number;
  created: Date;
  modified: Date;
  title: string;
  body: string;
}
