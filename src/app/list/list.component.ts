import { Component, OnInit } from '@angular/core';
import { BlogService, Post} from '../blog.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  posts: Post[] = [];
  selectedPost: Post;
  constructor(private blogService: BlogService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.getPosts();
    // this.activatedRoute.params.subscribe((params: Params) => { 
    //   this.posts = this.blogService.getPosts();
    // });
  }

  getPosts(): void{
    this.posts = this.blogService.getPosts();
  }

  newPost(): void{
    var new_post = this.blogService.newPost();
    this.router.navigate(["/edit/" + new_post.postid.toString()]);
  }

  onSelect(post: Post): void {
    this.selectedPost = post;
  }
}