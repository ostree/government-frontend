module ContentItem
  module Brexit
    def has_brexit_update?
      content_item["details"]["has_brexit_update"]
    end
  end
end
