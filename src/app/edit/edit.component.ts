import { Component, OnInit, Input } from '@angular/core';
import { BlogService, Post} from '../blog.service';
import { HostListener } from '@angular/core';
import { FormControl, FormGroup} from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  private post: Post;
  private form: FormGroup;
  private modified: string;

  constructor(
    private blogService: BlogService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(''),
      body: new FormControl('')
    }); 
    
    this.activatedRoute.params.subscribe((params: Params) => {
      var post = this.blogService.getPost(params['id']);
      if(post != null) {
        if(!this.form.pristine){
          this.save();
        }
        this.post = post;
      } 
      else {
        this.router.navigate(["/"]);
      }
    }); 

  }

  @HostListener('window:beforeunload') save() {
    this.form.markAsPristine();
    this.blogService.updatePost(this.post);
  }

  delete(){
    this.blogService.deletePost(this.post.postid);
    this.router.navigate(['/']);
  }
}
