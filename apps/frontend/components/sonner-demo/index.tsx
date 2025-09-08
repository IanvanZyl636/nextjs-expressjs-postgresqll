"use client"

import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { siteConfig } from "@/global/siteConfig";

export function SonnerDemo() {
  return (
    <Button
      variant="outline"
      onClick={() =>
        toast.error('Uh oh! Something went wrong.',{                
                description: (
                  <div>                    
                    There was a problem with your request.
                    <br />
                    Please try again later or contact{" "}
                    <a href={`tel:${siteConfig.phoneNumber}`}>
                      <b>{siteConfig.displayPhoneNumber}</b>
                    </a>
                  </div>
                ),
                duration: 6000,
              })
      }
    >
      Show Toast
    </Button>
  )
}
