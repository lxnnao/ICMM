class ImagesController < ApplicationController
  before_action :set_image, only: [:show, :edit, :update, :destroy]
  before_filter :find_image_by_param, :only=>[:show]
   #处理文件的上传
  def upload
    @image=Image.attach_files(params[:imgFile], params[:imgTitle])
    #@image=Image.attach_files(params[:imgFile], params[:imgTitle])
    #@image=Image.new

    if @image

      #render :text => {"error" => 0, "url" => "#{url_for :controller=>"image", :action=>"show", :id=>@image}" }.to_json
      render  :text => {"error" => (@image.image_id.to_s+@image.description.to_s+"tt") }
    else
      render  :text => {"error" => 1}
    end
  end
  # GET /images
  def index
    @images = Image.all
  end

  # GET /images/1
  #显示图片
  def show
    data=File.new(@image.diskfile, "rb").read
    send_data(data, :filename=>@image.filename,
      :type=>@image.content_type, :disposition => "inline")
  end
  #显示所有上传的图片
  def show_image_list
    @images=Image.find(:all)
    @json=[]
    @images.each do |image|
      temp= %Q/{
            "filesize" : "#{image.filesize}",
            "filename" : "#{image.filename}",
            "dir_path" : "#{url_for :controller=>"image", :action=>"show", :id=>image}.#{image.filename_suffix}",
            "datetime" : "#{image.created_on.strftime("%Y-%m-%d %H:%M")}"
      }/
      @json << temp
    end
    render :text => ("{\"file_list\":[" << @json.join(", ") << "]}")
  end
  # GET /images/new
  def new
    @image = Image.new
  end

  # GET /images/1/edit
  def edit
  end

  # POST /images
  def create
    @image = Image.new(image_params)

    if @image.save
      redirect_to @image, notice: 'Image was successfully created.'
    else
      render action: 'new'
    end
  end

  # PATCH/PUT /images/1
  def update
    if @image.update(image_params)
      redirect_to @image, notice: 'Image was successfully updated.'
    else
      render action: 'edit'
    end
  end

  # DELETE /images/1
  def destroy
    @image.destroy
    redirect_to images_url, notice: 'Image was successfully destroyed.'
  end

    private
    def find_image_by_param
      @image=Image.find(params[:id]) if  params[:id]
    end

    # Use callbacks to share common setup or constraints between actions.
    def set_image
      @image = Image.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def image_params
      params.require(:image).permit(:image_id, :filename, :disk_filename, :filesize, :content_type, :description, :author_id, :create_time, :update_time)
    end
end
