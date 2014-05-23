class AddPubdateAndOperaterAndRemarkAndTotalreportsToSurveys < ActiveRecord::Migration
  def change
    add_column :surveys, :Pubdate, :datetime
    add_column :surveys, :TotalReports, :integer
    add_column :surveys, :Operater, :string
    add_column :surveys, :Remark, :string
  end
end
