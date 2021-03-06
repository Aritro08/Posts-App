import { Injectable } from "@angular/core";
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.backendUrl + 'posts/';

@Injectable({providedIn: 'root'})

export class PostService {

  constructor(private http: HttpClient, private router: Router) {}

  posts: Post[] = [];

  postChanged = new Subject<{posts: Post[], postCount: number, size: number}>();

  getPostById(id: string) {
    return this.http.get<{_id: string, title: string, content: string, imagePath: string, creator: string, userName: string}>(BACKEND_URL + id);
  }

  getPosts(postsPerPage: number, curPage: number) {
    const queryParams = `?size=${postsPerPage}&page=${curPage}`;
    this.http.get<{message: string, posts: any, postCount: number, size: number}>(BACKEND_URL + queryParams)
    .pipe(
      map(postData => {
        return {
          posts: postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath,
              creator: post.creator,
              userName: post.userName
            };
          }),
          postCount: postData.postCount,
          size: postData.size
        };
      })
    ).subscribe(postData => {
      this.posts = postData.posts;
      this.postChanged.next({posts: this.posts.slice(), postCount: postData.postCount, size: postData.size});
    });
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http.post<{message: string, post: Post}>(BACKEND_URL, postData).subscribe(resData => {
      //Adding post to local posts array :
      //-------------------------------------------------------
      // const post: Post = { id: resData.post.id, title: title, content: content, imagePath: resData.post.imagePath };
      // this.posts.push(post);
      // this.postChanged.next(this.posts.slice());
      //-------------------------------------------------------
      //navigates to list page where posts will be fetched from db on ngInit()
      this.router.navigate(['/']);
    });
  }

  editPost(id: string, title: string, content: string, image: File | string) {
    let postData;
    if(typeof image == 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = { id: id, title: title, content: content, imagePath: image };
    }

    this.http.put<{message: string, imagePath: string}>(BACKEND_URL + id, postData).subscribe(resData => {
      //Updating post on local posts array :
      //------------------------------------------------------
      // const updatedPosts = [...this.posts];
      // const i = updatedPosts.findIndex(post => post.id == id);
      // const post = { id: id, title: title, content: content, imagePath: resData.imagePath };
      // updatedPosts[i] = post;
      // this.posts = updatedPosts;
      // this.postChanged.next(this.posts.slice());
      //-------------------------------------------------------
      //navigates to list page where posts will be fetched from db on ngInit()
      console.log(resData);
      this.router.navigate(['/']);
    });
  }

  deletePost(id: string) {
    return this.http.delete<{message: string}>(BACKEND_URL + id);
    // .subscribe((message) => {
    //   this.posts = this.posts.filter(post => post.id != id);
    //   this.postChanged.next(this.posts.slice());
    // });
  }
}
