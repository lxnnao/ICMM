module AbstractFile
  #上传的文件在服务器端上的目录路径
  #cattr_accessor :storage_path
  @@storage_path = "#{Rails.root}/files"
  @@size_limit=7*1024*1024
def validate_inner
    validate
  # 验证title不能为空
  self.errors.add(:filename, "标题不能为空") if self.filename.empty?
  # 下面校验上传的图片
  if self.content_type != nil
    if self.filesize != nil
      # 校验上传图片的文件大小
      if self.filesize > file_size_limit
        self.errors.add("file_size_limit", "贴图文件太大，#{file_size_limit}应不能超过50KB")
      end
    end
  end
end
def validate
   nil
end
  #这里由页面上提交的一个file表单对象来得到文件其它属性
  	def file=(file_field)
  		unless file_field.nil?
	      @temp_file = file_field
	      if @temp_file.size > 0
	      	transaction do
		        self.filename = sanitize_filename(@temp_file.original_filename)
		        self.disk_filename =AbstractFile.disk_filename(filename)
		        self.content_type = @temp_file.content_type.to_s.chomp
		        if content_type.blank?
		          self.content_type = content_type_by_filename(filename)
		        end
		        self.filesize = @temp_file.size
			    end
	      end
	    end
  	end

  #为Image对象设置file属性
  def file
     @temp_file
  end

  #保存由文件域上传提交的文件
  def attach_files(file_field, description=nil)
      self.description=description
      self.file= file_field
      self.validate_inner
      if errors.blank? then
        if load_file && self.save then
          self
        else
          nil
        end
      else
        nil
      end
  end
  def load_file
    begin
      File.open(diskfile, "wb") do |f|
        f.write(file.read)
      end
    rescue
      self.errors.add("file_load", "上传文件失败！")
      nil
    end
  end
  def file_size_limit
      @@size_limit
  end
	def store_dir
		  @@storage_path
	end

  # 在删除数据库文件信息时将本地的文件也连带删除
  def after_destroy
    File.delete(diskfile) if !filename.blank? && File.exist?(diskfile)
  end

  #返回文件在服务端的地址
  def diskfile
    "#{@@storage_path}/#{self.disk_filename}"
  end


  #得到文件的后缀名
  def filename_suffix
    m= self.filename.to_s.match(/(^|\.)([^\.]+)$/)
    m[2].downcase
  end

  #private
  #规范filename
  def sanitize_filename(value)
    # get only the filename, not the whole path
    #将文件名中的\和/符号去掉
    just_filename = value.gsub(/^.*(\\|\/)/, '')
    # NOTE: File.basename doesn't work right with Windows paths on Unix
    # INCORRECT: just_filename = File.basename(value.gsub('\\\\', '/'))

    # Finally, replace all non alphanumeric, hyphens or periods with underscore
    @filename = just_filename.gsub(/[^\w\.\-]/,'_')
  end

  # Returns an ASCII or hashed filename
  # 返回一个由时ascii码与时间截组成的文件名
  def self.disk_filename(filename)
    #得到当前的时间截
    timestamp = DateTime.now.strftime("%y%m%d%H%M%S")
    ascii = ''
    if filename =~ %r{^[a-zA-Z0-9_\.\-]*$}
      ascii = filename
    else
      ascii = Digest::MD5.hexdigest(filename)
      # keep the extension if any
      ascii << $1 if filename =~ %r{(\.[a-zA-Z0-9]+)$}
    end
    #判断当前目录中是否存在生成的文件
    while File.exist?(File.join(@@storage_path, "#{timestamp}_#{ascii}"))
      #如果生成的文件名与目录中的文件相冲突则调用succ方法来去重
      timestamp.succ!
    end
    "#{timestamp}_#{ascii}"
  end

  #由filename来得到ContentType
  def content_type_by_filename(filename)
    #m = filename.to_s.match(/(^|\.)([^\.]+)$/)
    #case m[2].downcase
    m=self.filename_suffix(filename)
    case m
    when 'gif' then  return'image/gif'
    when 'jpg','jpeg','jpe' then return 'image/jpeg'
    when 'png' then return 'image/png'
    when 'tiff','tif' then return 'image/tiff'
    when  "bmp" then return "image/x-ms-bmp"
    when 'xpm' then return "image/x-xpixmap"
    when "ico" then return "image/x-icon"
    when "xq","xql","xquery","xsd","xsl","xslt","xml","wsdl","dtd" then return "text/xml"
    when "txt" then return "text/plain"
    when "rtf","dot","doc","docx" then return "application/msword"
    when "htm","html","htx" then return "text/html"
    end
  end
end