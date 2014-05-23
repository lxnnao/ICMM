class AddContentTypeToAnswers < ActiveRecord::Migration
  def change
    add_column :answers, :content_type, :string
  end
end
