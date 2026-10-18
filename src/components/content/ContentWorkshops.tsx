import YouTubeVideo from '@/components/YouTubeVideo'
import { getWorkshops } from '@/lib/content-queries'
import type { Workshop } from '@/lib/content'

export default async function ContentWorkshops() {
  const workshops = await getWorkshops()

  if (!workshops || workshops.length === 0) {
    return (
      <section className="mt-16">
        <div className="mx-auto max-w-7xl">
          <div className="py-12 text-center">
            <p className="text-charcoal/60">
              No workshops found. Please check your Content configuration.
            </p>
          </div>
        </div>
      </section>
    )
  }

  // Only show recorded workshops
  const recordedWorkshops = workshops.filter((workshop: Workshop) => workshop.isRecorded)

  return (
    <>
      {/* Workshop Recordings */}
      <section className="py-10 sm:py-12">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">
            01 · Watch and learn
          </p>
          <h2 className="mt-3 font-heading text-2xl font-semibold text-bark sm:text-3xl">
            Workshop recordings
          </h2>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-1">
          {recordedWorkshops.map((workshop: Workshop) => (
            <article
              key={workshop._id}
              className="overflow-hidden border border-charcoal/10 bg-white transition-colors hover:border-clay/40"
            >
              <div className="grid gap-6 md:grid-cols-2">
                {/* Video Preview */}
                <div className="p-5 sm:p-6">
                  {workshop.videoUrl && (
                    <YouTubeVideo
                      videoId={workshop.videoUrl}
                      title={workshop.title}
                      className="w-full"
                    />
                  )}
                </div>

                {/* Workshop Details */}
                <div className="flex flex-col justify-between border-t border-charcoal/10 p-5 sm:p-6 md:border-l md:border-t-0">
                  <div>
                    <div className="mb-3 flex items-center gap-3">
                      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-clay">
                        Recording
                      </span>
                      <span className="text-sm text-charcoal/60">Free Access</span>
                    </div>
                    <h3 className="mb-3 font-heading text-lg font-semibold">{workshop.title}</h3>
                    <p className="mb-4 text-sm leading-relaxed text-charcoal/85">
                      {workshop.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sand">
                      <span className="text-xs font-semibold text-charcoal">
                        {workshop.instructor
                          .split(' ')
                          .map((n: string) => n[0])
                          .join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{workshop.instructor}</p>
                      <p className="text-xs text-charcoal/60">{workshop.instructorRole}</p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
