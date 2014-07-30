class FileManage < ApplicationController
  require 'ftools'
  def self.uploadFile(file,data)         #上传文件
    filepath = Time.now.strftime("%Y%m%d")
    path = "#{getFilePath}#{filepath}"
    #if !file.original_filename.empty?
    if !File.exist?(path)
      File.makedirs(path,true)              #创建文件夹
    end
      #生成一个随机的文件名
      @filename = getFileName(FileManage.new.original_filename(file))
      #向dir目录写入文件
      File.open("#{path}/#{@filename}","wb+")do |f|
        f.write(data)
      end
    #end
    #返回文件名称，保存到数据库中
    return "#{filepath}/#{@filename}"
  end

  def original_filename(file)
      file.original_filename.strip
  end

  def self.getFileName(filename)    #建立以当前时间为文件名
    filepath = Time.now.strftime("%Y%m%d%H%M%S")
    if !filename.nil?
      name = File.basename(filename)
      str = name.split('.')
      name = "#{filepath}.#{str[1]}"
      #name.gsub(/[^\w._-]/, '')
      return name
    end
  end
  def self.deleFile(filepath)           #删除指定文件
    #Dir["/tmp/a*"].each {|f| File.delete(f)}     #删除/tmp下面的a*文件
    File.delete("#{getFilePath}#{filepath}")      #删除指定文件
  end
end