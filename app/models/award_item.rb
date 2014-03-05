class AwardItem < ConnectionAdapter
  self.table_name = 'im_awarditem'
  self.primary_key = 'award_item_id'
  belongs_to :award,:class_name => 'Award',:primary_key => 'award_id', :foreign_key => "award_id"
end