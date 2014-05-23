class AddSurveyDesciptionAndPublisherToSurveys < ActiveRecord::Migration
  def change
    add_column :surveys, :survey_desciption, :string
    add_column :surveys, :publisher, :string
  end
end
