class CreateClubs < ActiveRecord::Migration
  def change
    create_table :clubs do |t|
      t.string :club_id
      t.string :club_name
      t.string :status
      t.text :descriptions
      t.string :language_type
      t.string :operator
      t.datetime :create_time
      t.datetime :update_time

      t.timestamps
    end
  end
end
