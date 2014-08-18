class CreateFavorites < ActiveRecord::Migration
  def change
    create_table :favorites do |t|
      t.string,content_id :user_id

      t.timestamps
    end
  end
end
