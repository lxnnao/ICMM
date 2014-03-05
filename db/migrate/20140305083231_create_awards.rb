class CreateAwards < ActiveRecord::Migration
  def change
    create_table :awards do |t|
      t.string :award_id
      t.string :name
      t.string :activity_id
      t.integer :qty
      t.string :status
      t.string :descriptions
      t.datetime :create_time
      t.datetime :update_time

      t.timestamps
    end
  end
end
