require 'test_helper'

class FamiliesControllerTest < ActionController::TestCase
  setup do
    @family = families(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:families)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create family" do
    assert_difference('Family.count') do
      post :create, family: { bus_line: @family.bus_line, create_time: @family.create_time, email: @family.email, emp_id: @family.emp_id, family_id: @family.family_id, family_idcard: @family.family_idcard, family_name: @family.family_name, is_child: @family.is_child, m_f: @family.m_f, name: @family.name, phone: @family.phone, update_time: @family.update_time }
    end

    assert_redirected_to family_path(assigns(:family))
  end

  test "should show family" do
    get :show, id: @family
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @family
    assert_response :success
  end

  test "should update family" do
    patch :update, id: @family, family: { bus_line: @family.bus_line, create_time: @family.create_time, email: @family.email, emp_id: @family.emp_id, family_id: @family.family_id, family_idcard: @family.family_idcard, family_name: @family.family_name, is_child: @family.is_child, m_f: @family.m_f, name: @family.name, phone: @family.phone, update_time: @family.update_time }
    assert_redirected_to family_path(assigns(:family))
  end

  test "should destroy family" do
    assert_difference('Family.count', -1) do
      delete :destroy, id: @family
    end

    assert_redirected_to families_path
  end
end
