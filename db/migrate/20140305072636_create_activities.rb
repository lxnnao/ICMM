class CreateActivities < ActiveRecord::Migration
  def change
    create_table :activities do |t|
      t.string :activity_id
      t.string :activity_name
      t.string :activity_type
      t.datetime :startdate
      t.datetime :starttime
      t.datetime :endtime
      t.string :venues
      t.string :durringtime
      t.string :presenter
      t.text :descriptions
      t.integer :volunteers
      t.integer :attendees
      t.boolean :has_award
      t.string :department_id
      t.string :language_type
      t.string :status
      t.string :activity_name_eng
      t.string :venues_eng
      t.string :remark
      t.string :contact_id
      t.string :operator
      t.datetime :create_time
      t.datetime :update_time

      t.timestamps
    end
  end
end
