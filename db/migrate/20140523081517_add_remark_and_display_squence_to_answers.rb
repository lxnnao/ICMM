class AddRemarkAndDisplaySquenceToAnswers < ActiveRecord::Migration
  def change
    add_column :answers, :display_squence, :integer
    add_column :answers, :remark, :string
  end
end
