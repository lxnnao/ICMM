class AddIsRequiredAndContentTypeAndDisplaySquenceToQuestions < ActiveRecord::Migration
  def change
    add_column :questions, :is_required, :string
    add_column :questions, :content_type, :string
    add_column :questions, :display_squence, :integer
  end
end
