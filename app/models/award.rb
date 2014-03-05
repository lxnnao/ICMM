class Award < ActiveRecord::Base
  establish_connection("eic_dev")
  self.table_name = 'im_award'
  self.primary_key = 'award_id'
  has_one :activity,:class_name => 'Activity',:primary_key => 'activity_id', :foreign_key => "activity_id"
  has_many :items, :class_name => 'AwardItem',:primary_key => 'award_id', :foreign_key => "award_id"
end
