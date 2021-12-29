if RUBY_VERSION == "3.1.0"
  require "did_you_mean"
  class MySilentMapping
    def []=(key, value)
      DidYouMean.correct_error(key, value)
    end
    def merge!(hash)
      hash.each do |error_class, spell_checker|
        DidYouMean.correct_error(error_class, spell_checker)
      end
    end
  end
  module DidYouMean
    remove_const :SPELL_CHECKERS
    SPELL_CHECKERS = MySilentMapping.new
  end
end
