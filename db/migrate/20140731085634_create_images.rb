class CreateImages < ActiveRecord::Migration
  def change
    create_table :images do |t|
      t.string :image_id
      t.string :filename
      t.string :disk_filename
      t.integer :filesize
      t.string :content_type
      t.string :description
      t.string :author_id
      t.datetime :create_time
      t.datetime :update_time

      t.timestamps
    end
  end
end
