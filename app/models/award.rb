class Award < ConnectionAdapter
  self.table_name = 'im_award'
  self.primary_key = 'award_id'
  belongs_to :activity,:class_name => 'Activity',:primary_key => 'activity_id', :foreign_key => "activity_id"
end
