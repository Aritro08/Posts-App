export  class Post {
  id: string;
  title: string;
  content: string;
  imagePath: string;

  constructor(id:string, title: string, content: string, imagePath: string) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.imagePath = imagePath;
  }
}
