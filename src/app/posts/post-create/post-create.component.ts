import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit {

  editMode = false;
  postId = null;
  post: Post = {
    id: null,
    title: null,
    content: null,
    imagePath: null,
    creator: null,
    userName: null
  };
  postForm: FormGroup;
  imagePrev: string = '';

  constructor(private postService: PostService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.postForm = new FormGroup({
      'title': new FormControl(null, {validators: [Validators.required]}),
      'content': new FormControl(null, {validators: [Validators.required]}),
      'image': new FormControl(null)
    });

    this.route.paramMap.subscribe((params: ParamMap) => {
      if(params.has('id')) {
        this.editMode = true;
        this.postId = params.get('id');
        this.postService.getPostById(this.postId).subscribe(postData => {
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath,
            creator: postData.creator,
            userName: postData.userName
          }
          this.postForm.setValue({
            'title': this.post.title,
            'content': this.post.content,
            'image': this.post.imagePath
          });
        });
      } else {
        this.editMode = false;
        this.postId = null;
      }
    });
  }

  onAddPost() {
    const title = this.postForm.value.title;
    const content = this.postForm.value.content;
    const image = this.postForm.value.image;
    if(this.editMode) {
      this.postService.editPost(this.postId, title, content, image);
    } else {
      this.postService.addPost(title, content, image);
    }
  }

  onAddImage(event: Event) {
    // Image preview
    const file = (<HTMLInputElement>event.target).files[0];
    this.postForm.patchValue({image: file});
    this.postForm.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePrev = (<string>reader.result);
    }
    reader.readAsDataURL(file);
  }

}
