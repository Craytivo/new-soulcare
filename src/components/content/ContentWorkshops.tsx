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
      <section className="mt-16">
        <h2 className="mb-6 font-heading text-2xl font-semibold">Workshop Recordings</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-1">
          {recordedWorkshops.map((workshop: Workshop) => (
            <article
              key={workshop._id}
              className="overflow-hidden rounded-2xl bg-white ring-1 ring-charcoal/10 transition-all duration-200 hover:ring-clay/30"
            >
              <div className="grid gap-6 md:grid-cols-2">
                {/* Video Preview */}
                <div className="p-6">
                  {workshop.videoUrl && (
                    <YouTubeVideo
                      videoId={workshop.videoUrl}
                      title={workshop.title}
                      className="w-full"
                    />
                  )}
                </div>

                {/* Workshop Details */}
                <div className="flex flex-col justify-between p-6">
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <span className="rounded-full bg-sand px-3 py-1 text-xs font-medium text-charcoal">
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
