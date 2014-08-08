class Image < ActiveRecord::Base
	include AbstractFile


    # def file_size_limit
    #    1024
    # end

	# def store_dir
	# 	"#{Rails.root}/upload"
	# end
	def validate
		if self.content_type != nil
		    # 校验上传图片的文件类型
		    unless self.content_type =~ /^image/
		      self.errors.add(:content_type, "贴图不是合法的图片文件")
		    end
		end
	end

	#在保存image对象之前将上传的文件得到并保存在服务器上的目录中(已内置)
	# before_save do
	# 	self.image_id=100 #定制ID
    #        errors.each do |attribute, error|
    #        	self.description=error
    #        end
	# end

	#保存由文件域上传提交的文件
	def self.attach_files(file_field, description=nil,author_id=nil)
		if file_field&&file_field.size > 0   #这里的作者用于测试
	        image=Image.new()
	        image.image_id=100
	        image.description=description
			image.file= file_field
			image.validate_inner
            if image.errors.blank? then
              if image.load_file && image.save then
                image
              else
                nil
              end
            else
              nil
            end
		end
	end
end