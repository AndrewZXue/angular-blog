import { Component, OnInit } from '@angular/core';
import { BlogService, Post} from '../blog.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Parser, HtmlRenderer } from 'commonmark';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})

export class PreviewComponent implements OnInit {

  private post: Post;
  private titlePreview: String;
  private bodyPreview: String;

  constructor(
    private blogService: BlogService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      var post = this.blogService.getPost(params['id']);
      if(post != null){
        this.post = post;
        var reader = new Parser();
        var writer = new HtmlRenderer();
        this.titlePreview = writer.render(reader.parse(this.post.title));
        this.bodyPreview = writer.render(reader.parse(this.post.body));
      }
      else{
        this.router.navigate(['/']);
      }
    });
  }

  back(): void{
    this.router.navigate(['/edit/' + this.post.postid.toString()]);
  }

}
