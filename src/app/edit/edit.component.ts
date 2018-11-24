import { Component, OnInit } from '@angular/core';
import { BlogService, Post} from '../blog.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  title: String = "";
  body: String = "";
  constructor(private blogService: BlogService) { }

  ngOnInit() {
  }

}
