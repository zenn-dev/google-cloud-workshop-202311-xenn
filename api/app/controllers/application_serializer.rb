class ApplicationSerializer
  include JSONAPI::Serializer

  def to_h
    data = serializable_hash
    nd = data[:data]

    case nd
    when Hash
      nd[:attributes]
    when Array
      nd.pluck(:attributes)
    when nil
      nil
    else
      data
    end
  end

  class << self
    # rubocop:disable Naming/PredicateName
    def has_one(resource, options = {})
      serializer = options[:serializer] || "#{resource.to_s.classify}Serializer".constantize

      attribute resource do |object|
        serializer.new(object.try(resource)).to_h
      end
    end

    def has_many(resources, options = {})
      serializer = options[:serializer] || "#{resources.to_s.classify}Serializer".constantize

      attribute resources do |object|
        serializer.new(object.try(resources)).to_h
      end
    end

    # rubocop:enable Naming/PredicateName
  end
end
