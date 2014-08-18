class CreateFavorites < ActiveRecord::Migration
  def change
    create_table :favorites do |t|
      t.string :favor_user_id
      t.string :content_id
      t.string :content_type
      t.integer :isenable

      t.timestamps
    end
  end
end
