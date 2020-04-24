import { Injectable } from "@angular/core";
import { Post } from './post.model';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})

export class PostService {

  posts: Post[] = [
    new Post('Title 1', 'Content 1'),
    new Post('Title 2', 'Content 2')
  ];

  postChanged = new Subject<Post[]>();

  getPosts() {
    return this.posts.slice();
  }

  addPost(title: string, content: string) {
    const post = new Post(title, content);
    this.posts.push(post);
    this.postChanged.next(this.posts.slice());
  }

}
