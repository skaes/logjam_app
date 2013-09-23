module TimeBandits
  add Logjam::MongoTimeConsumer
  add TimeConsumers::Dalli
  add TimeConsumers::GarbageCollection.instance if GC.respond_to?(:enable_stats)
end
