class FileManagesController < ApplicationController
  def upload          #上传图片
    render :text=>"testddd"
    hidden = params[:hidden1]
    if hidden == "yes"
      render :text=>"testddd"
      unless request.get?
        filename = params[:imageFile]
        file_data = params[:imageFile].read
        path = FileManage.uploadFile(filename,file_data)         #图片保存
        #render :text => JsClass.getIframe("#{getFilePath}#{path}")
      end
    end
  end
end