class PreviewImg {
  constructor(props){
    /*
    * props {
    *   container : containerElement
    * }
    */
    this.props = props;
    this.props.imgInfos = [];
    if(!this.props.element)
      this.props.element = {};
    this.imgIdx = 0;
    this.previewInit();
  }

  previewInit(){
    var container = this.props['target'];
    var uploadBtns = $(container).find('[sm-act="img_upload"]');
    var previews = $(container).find('[sm-act="img_preview"]');
    var app = this;
    uploadBtns.click(uploadClickEvent);
    var info = [];

    function uploadClickEvent(ev){
      var fileTag = $('<input type="file" multiple="multiple">');


      fileTag.click();
      fileTag.change(function(){

        var files = this.files;
        for(var file of files) {

          var reader = new FileReader();

          reader.addEventListener('load',imgLoadEvent,false);
          console.log(file['type'])
          if(isImg(file)) {
            file.idx = app.imgIdx;
            info[app.imgIdx] = {
              file : file
            };


            reader.imgIdx = app.imgIdx;
            reader.readAsDataURL(file);
            info.file = file;
            app.imgIdx++;
          } else {
            throw new Error('NotFound ImgFile');
          }
        }
      })
    }
    function imgLoadEvent(){
        console.log('imgListener');
        var idx = this.imgIdx;
        var img = app.newImg();
        var imgWrapper = new Wrapper({
          name : 'img',
          content : img,
          events : {
            delete : function(){
              app.props.imgInfos[idx].isDelete = true;
              console.log(app.props.imgInfos)
            }
          }
        });
        console.log(this);
        try{
          img.attr('src',this.result); //jquery DomElement
        }catch(e){
          img.src = this.result;//DomElement
        }
        previews.append(imgWrapper.getWrapper());
        info[this.imgIdx].imgTag = img;
        var imgInfo = new ImgInfo(info[this.imgIdx]);
        app.props.imgInfos.push(imgInfo);
    }
    function isImg(file){
      return file['type'].indexOf('image') >= 0;
    }
  }

  newImg(){
    var img = this.props.element.img != null ?
        this.props.element.img.clone() : document.createElement('img');

    return img;
  }


}

class Wrapper{
  constructor(props){
    var name = props.name;
    var clsName = name.toLowerCase()+'_wrapper';
    this.props = props;
    this.name = name.toLowerCase();
    this.wrapper = $('<div>').attr('class',clsName);
    this.eventListener = {};
    this.eventInit();
    this.attrInit();
    this.childInit();

  }

  eventInit(){
    if( this.props.events ) {
      for(var event in this.props.events) {
        this.eventListener[event] = this.props.events[event];
      }
    }

  }
  childInit(){
    var wrapper = this.wrapper;
    var header = $('<div>').attr('class',this.name+'_header');
    var deleteIcon = $('<span>').attr({
      'class' : 'delete_icon',
      'sm-wrapper-act' : 'delete'
    }).html('X');
    var body = $('<div>').attr('class',this.name+'_body');
    var app = this;
    body.html(this.props.content);
    wrapper.append(header);
    wrapper.append(body);
    header.append(deleteIcon);
    deleteIcon.click(function(){
      wrapper.remove();
      if(app.eventListener.delete) {
        app.eventListener.delete(app);
      }
    })
  }
  attrInit(){
    if(this.props.attrs) {
      attrs = this.props.attrs;
      this.wrapper.attr(attrs);
    }

  }

  getWrapper(){
    return this.wrapper;
  }

  addEventListener(name,fun) {
    this.eventListener[name] = fun;
  }

}



class ImgInfo{
  constructor(props){
    this.imgTag = props.imgTag;
    this.file = props.file;
    this.name = props.name;
    this.isDelete = false;
  }
  getImgTag(){
    return this.imgTag;
  }
  getFile(){
    return this.file;
  }
  getName(){
    return this.name;
  }
}
