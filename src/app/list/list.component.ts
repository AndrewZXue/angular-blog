import { Component, OnInit } from '@angular/core';
import { BlogService, Post} from '../blog.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  posts: Post[] = [];
  selectedPost: Post;
  constructor(private blogService: BlogService) { }

  ngOnInit() {
    this.getPosts();
  }

  getPosts_mock(): void{
    this.blogService.getPosts_mock()
        .subscribe(posts => this.posts = posts);
  }
  getPosts(): void{
    this.posts = this.blogService.getPosts();
  }

  newPost(): void{
    let new_post = this.blogService.newPost();
    let new_postid = new_post.postid;
  }

  onSelect(post: Post): void {
    this.selectedPost = post;
  }
}