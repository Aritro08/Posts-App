import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  postsChangedSubs: Subscription;

  constructor(private postService: PostService) { }

  ngOnInit(): void {
    this.posts = this.postService.getPosts();
    this.postsChangedSubs = this.postService.postChanged.subscribe(posts => {
      this.posts = posts;
    });
  }

  ngOnDestroy() {
    this.postsChangedSubs.unsubscribe();
  }

}
