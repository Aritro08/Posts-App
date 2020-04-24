import { Component } from "@angular/core";
import { NgForm } from '@angular/forms';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent {

  constructor(private postService: PostService) {}

  onAddPost(postForm: NgForm) {
    const title = postForm.value.title;
    const content = postForm.value.content;
    this.postService.addPost(title, content);
    postForm.resetForm();
  }

}
