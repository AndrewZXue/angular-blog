import { Component, OnInit, Input } from '@angular/core';
import { BlogService, Post} from '../blog.service';
import { HostListener } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  @Input() post: Post;
  private form: FormGroup

  constructor(private blogService: BlogService) { }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(''),
      body: new FormControl('')
    }); 
    // this.post = this.blogService.getPost(this.post.postid);
  }

  @HostListener('window:beforeunload') save() {
    this.form.markAsPristine();
    this.blogService.updatePost(this.post);
  }

  delete(){
    this.blogService.deletePost(this.post.postid);
  }
}
